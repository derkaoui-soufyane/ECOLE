<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salle extends Model
{
    use HasFactory;
    protected $table="salle";
    protected $fillable = ['num_salle'];

    public function disponibilites()
    {
        return $this->hasMany(salle_diponible::class, 'salle_id');
    }
}