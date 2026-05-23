<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    use HasFactory;

    protected $table = 'etudiant';
    protected $fillable = [
        'prenom', 'nom', 'email', 'telephone', 'nom_parents', 'telephone_parent', 'id_filieres',"id_user","num_carte_parent","id_classe"
    ];

    public function filiere()
    {
        return $this->belongsTo(filieres::class, 'id_filieres');
    }

    public function notes()
    {
        return $this->hasMany(notes::class, 'etudiant_id');
    }
     public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function classe()
    {
        return $this->belongsTo(Classe::class, 'id_classe');
    }
}